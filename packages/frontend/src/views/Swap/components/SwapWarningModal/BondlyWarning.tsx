import React from 'react'
import { Text } from '@bds-libs/uikit'
import { useTranslation } from 'contexts/Localization'

const BondlyWarning = () => {
  const { t } = useTranslation()

  return <Text>{t('Warning: BONDLY has been compromised. Please remove liqudity until further notice.')}</Text>
}

export default BondlyWarning
