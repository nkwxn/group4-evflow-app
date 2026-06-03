import { createElement, useMemo } from 'react';

type SvgAssetIconProps = {
  color?: string;
  height: number;
  name?: 'close' | 'filter' | 'lightning' | 'rightArrow' | 'search' | 'tick';
  svg?: string;
  width: number;
};

export function SvgAssetIcon({ color, height, svg = '', width }: SvgAssetIconProps) {
  const html = useMemo(() => {
    const sizedSvg = svg
      .replace(/width="[^"]*"/, `width="${width}"`)
      .replace(/height="[^"]*"/, `height="${height}"`)
      .replace('<svg ', '<svg style="display:block" ');

    return color ? sizedSvg.replace(/fill="[^"]*"/g, `fill="${color}"`) : sizedSvg;
  }, [color, height, svg, width]);

  return createElement('span', {
    dangerouslySetInnerHTML: { __html: html },
    style: {
      alignItems: 'center',
      display: 'inline-flex',
      height,
      justifyContent: 'center',
      width
    }
  });
}
