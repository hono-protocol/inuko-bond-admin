import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { BIG_TEN } from 'utils/bigNumber'
import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { FarmConfig } from 'config/constants/types'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

const fetchFarms = async (farmsToFetch: FarmConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async farmConfig => {
      const masterChefAddress = getMasterChefAddress(farmConfig.masterChefContract)
      const lpAddress = getAddress(farmConfig.lpAddresses)
      const calls = [
        // Balance of token in the LP contract
        {
          address: getAddress(farmConfig.token.address),
          name: 'balanceOf',
          params: [lpAddress]
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(farmConfig.quoteToken.address),
          name: 'balanceOf',
          params: [lpAddress]
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAddress,
          name: 'balanceOf',
          params: [masterChefAddress]
        },
        // Total supply of LP tokens
        {
          address: lpAddress,
          name: 'totalSupply'
        },
        // Token decimals
        {
          address: getAddress(farmConfig.token.address),
          name: 'decimals'
        },
        // Quote token decimals
        {
          address: getAddress(farmConfig.quoteToken.address),
          name: 'decimals'
        }
      ]

      const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
        await multicall(erc20, calls)

      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

      let lpTotalInQuoteToken: BigNumber

      if (farmConfig.quoteToken === farmConfig.token) {
        lpTotalInQuoteToken = new BigNumber(lpTokenBalanceMC).div(new BigNumber(10).pow(tokenDecimals))
      } else {
        lpTotalInQuoteToken = new BigNumber(quoteTokenBalanceLP)
          .div(BIG_TEN.pow(farmConfig.quoteToken.decimals ?? 18))
          .times(new BigNumber(2))
          .times(lpTokenRatio)
      }
      let quoteTokenToMultiplyQuoteTokenPrice: BigNumber

      if (farmConfig.quoteToken === farmConfig.token) {
        quoteTokenToMultiplyQuoteTokenPrice = new BigNumber(1)
      } else {
        quoteTokenToMultiplyQuoteTokenPrice = new BigNumber(quoteTokenBalanceLP)
          .div(BIG_TEN.pow(farmConfig.quoteToken.decimals ?? 18))
          .times(new BigNumber(2))
          .div(new BigNumber(lpTotalSupply).div(DEFAULT_TOKEN_DECIMAL))
      }

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const tokenAmount = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals)).times(lpTokenRatio)
      const quoteTokenAmount = new BigNumber(quoteTokenBalanceLP)
        .div(BIG_TEN.pow(quoteTokenDecimals))
        .times(lpTokenRatio)

      const [info, totalAllocPoint, masterChefPerBlock] = await multicall(masterchefABI, [
        {
          address: masterChefAddress,
          name: 'poolInfo',
          params: [farmConfig.pid]
        },
        {
          address: masterChefAddress,
          name: 'totalAllocPoint'
        },
        {
          address: masterChefAddress,
          name: 'BEP20TokenPerBlock'
        }
      ])

      const allocPoint = new BigNumber(info.allocPoint._hex)
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))
      const harvestInterval = new BigNumber(0)
      const depositFeeBP = new BigNumber(info.depositFeeBP)
      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
        poolWeight: poolWeight.toJSON(),
        multiplier: `${allocPoint.div(100).toString()}X`,
        depositFeeBP: depositFeeBP.div(100).toString(),
        harvestInterval: harvestInterval.div(60).div(60).toString(),
        perBlock: new BigNumber(
          farmConfig.openAt && farmConfig.beforeOpenPerBlock && farmConfig.openAt > new Date().getTime()
            ? farmConfig.beforeOpenPerBlock
            : masterChefPerBlock[0].toString()
        )
          .div(new BigNumber(10).pow(farmConfig.earnToken.decimals || 18))
          .toJSON(),
        quoteTokenToMultiplyQuoteTokenPrice: quoteTokenToMultiplyQuoteTokenPrice.toJSON()
      }
    })
  )

  return data
}

export default fetchFarms
