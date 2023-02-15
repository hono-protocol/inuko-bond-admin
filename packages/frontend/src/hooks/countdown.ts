import React from "react";

function countDown(time: number) {
    const distance = time - Date.now();
    const _second = 1000;
    const _minute = _second * 60;
    const _hour = _minute * 60;
    const _day = _hour * 24;
  
    if (distance > 0) {
      const days = Math.floor(distance / _day);
      const hours = Math.floor((distance % _day) / _hour);
      const minutes = Math.floor((distance % _hour) / _minute);
      const seconds = Math.floor((distance % _minute) / _second);
      return {
        isFinished: false,
        days,
        hours,
        minutes,
        seconds,
      };
    } else {
      return {
        isFinished: true,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }
  }
  
  export function useCountDown(time?: number) {
    const [state, setState] = React.useState({
      isFinished: false,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
  
    React.useEffect(() => {
      const current = countDown(time);
      let interval;
      setState(current);
  
      if (!current.isFinished) {
        interval = setInterval(() => {
          setState(countDown(time));
        }, 1000);
      }
      return () => {
        clearInterval(interval);
      };
    }, [time]);
  
    return state;
  }
  
  export function formatCountDown(count: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }) {
    function formatDigit(digit: number) {
      return digit < 10 ? `0${digit}` : digit;
    }
  
    return {
      days: formatDigit(count.days),
      hours: formatDigit(count.hours),
      minutes: formatDigit(count.minutes),
      seconds: formatDigit(count.seconds),
    };
  }