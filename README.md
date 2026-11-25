# WCAG 2.2 Color Contrast Checker

A dependency-free static site that checks a foreground/background color pair against WCAG 2.2 contrast criteria.

## Criteria checked

| Criterion | Level | Normal text | Large text / UI |
|---|---|---|---|
| 1.4.3 Contrast (Minimum) | AA | 4.5:1 | 3:1 |
| 1.4.6 Contrast (Enhanced) | AAA | 7:1 | 4.5:1 |
| 1.4.11 Non-text Contrast | AA | n/a | 3:1 |

Large text = at least 18pt (24px), or 14pt (about 18.66px) bold.

## Method

Relative luminance `L = 0.2126 R + 0.7152 G + 0.0722 B` on linearized sRGB; ratio `(L1 + 0.05) / (L2 + 0.05)` with L1 the lighter color. Displayed values are truncated, never rounded up.

## Limits

Hex input only; no alpha, gradients or images. WCAG 3.0 (APCA-based) is still a draft and is not used.

## Run

Open `index.html`, or enable GitHub Pages (Settings > Pages > Deploy from branch > main / root).
