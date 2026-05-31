import { createElement, useMemo } from 'react';
import type { DriverTabKey } from '../types';

import mapIcon from '../../assets/images/map.svg?raw';
import profileIcon from '../../assets/images/profile.svg?raw';
import scanIcon from '../../assets/images/qr-scan.svg?raw';
import routeIcon from '../../assets/images/route.svg?raw';
import walletIcon from '../../assets/images/wallet.svg?raw';

type DriverAssetIconProps = {
  name: DriverTabKey;
  color: string;
};

const icons: Record<DriverTabKey, string> = {
  map: mapIcon,
  wallet: walletIcon,
  scan: scanIcon,
  plan_route: routeIcon,
  profile: profileIcon
};

export function DriverAssetIcon({ name, color }: DriverAssetIconProps) {
  const svg = useMemo(
    () =>
      icons[name]
      .replace(/#3B494A/g, color)
      .replace(/black/g, color)
      .replace(/white/g, color)
      .replace('<svg ', '<svg style="display:block" '),
    [color, name]
  );

  return createElement('span', {
    dangerouslySetInnerHTML: { __html: svg },
    style: {
      alignItems: 'center',
      display: 'inline-flex',
      height: 24,
      justifyContent: 'center',
      width: 24
    }
  });
}
