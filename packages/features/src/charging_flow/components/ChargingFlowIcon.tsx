import { createElement, useMemo } from 'react';

export type ChargingIconName = 'close' | 'connector' | 'flashlight' | 'help' | 'leftArrow' | 'stop' | 'timer' | 'wallet_bg' | 'piggy' | 'receipt' | 'location' | 'shield' | 'lightning' | 'copy' | 'download' | 'wallet';

import closeIcon from '../../assets/images/close-button-icon.svg?raw';
import connectorIcon from '../../assets/images/connector.svg?raw';
import flashlightIcon from '../../assets/images/camera-flashlight.svg?raw';
import helpIcon from '../../assets/images/query-in-circle.svg?raw';
import leftArrowIcon from '../../assets/images/left-arrow.svg?raw';
import timerIcon from '../../assets/images/timer.svg?raw';
import wallet_bgIcon from '../../assets/images/wallet-with-bg.svg?raw';
import piggyIcon from '../../assets/images/piggy-bank.svg?raw';
import receiptIcon from '../../assets/images/receipt.svg?raw';
import stopIcon from '../../assets/images/stop-in-circle.svg?raw';
import locationIcon from '../../assets/images/location-info.svg?raw';
import shieldIcon from '../../assets/images/shield.svg?raw';
import lightningIcon from '../../assets/images/lightning-icon.svg?raw';
import copyIcon from '../../assets/images/copy-button.svg?raw';
import downloadIcon from '../../assets/images/download.svg?raw';
import walletIcon from '../../assets/images/wallet.svg?raw';

const icons: Record<ChargingIconName, string> = {
  close: closeIcon,
  connector: connectorIcon,
  flashlight: flashlightIcon,
  help: helpIcon,
  leftArrow: leftArrowIcon,
  stop: stopIcon,
  timer: timerIcon,
  wallet_bg: wallet_bgIcon,
  piggy: piggyIcon,
  receipt: receiptIcon,
  location: locationIcon,
  shield: shieldIcon,
  lightning: lightningIcon,
  copy: copyIcon,
  download: downloadIcon,
  wallet: walletIcon,
};

export function ChargingFlowIcon({ name, color, size = 24 }: { name: ChargingIconName, color?: string, size?: number }) {
  const svg = useMemo(() => {
    let raw = icons[name];
    if (color) {
      raw = raw.replace(/fill="[^"]+"/g, `fill="${color}"`);
    }
    return raw.replace('<svg ', `<svg width="${size}" height="${size}" style="display:block" `);
  }, [color, name, size]);

  return createElement('span', {
    dangerouslySetInnerHTML: { __html: svg },
    style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }
  });
}
