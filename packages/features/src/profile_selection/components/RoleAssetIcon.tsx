import { createElement, useMemo } from 'react';
import type { UserRole } from '../types';

import businessPlannerIcon from '../../assets/images/business-planner-graph.svg?raw';
import driverIcon from '../../assets/images/ev-car-driver.svg?raw';

type RoleAssetIconProps = {
  color: string;
  role: UserRole;
};

const icons: Record<UserRole, string> = {
  driver: driverIcon,
  operator: businessPlannerIcon
};

export function RoleAssetIcon({ color, role }: RoleAssetIconProps) {
  const svg = useMemo(
    () =>
      icons[role]
        .replace(/fill="[^"]*"/g, `fill="${color}"`)
        .replace('<svg ', '<svg style="display:block" '),
    [color, role]
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
