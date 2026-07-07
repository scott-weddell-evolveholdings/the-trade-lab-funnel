# PoolMasters Design System CSS Notes

## Colors

```css
:root {
  --pm-navy: #061E33;
  --pm-navy-light: #0A3558;
  --pm-blue: #009FE3;
  --pm-aqua: #35D6FF;
  --pm-white: #FFFFFF;
  --pm-mist: #F4F8FB;
  --pm-slate: #334155;
  --pm-charcoal: #0F172A;
  --pm-gold: #F5B942;
}
```

## Gradients

### Primary Button Gradient

```css
.pm-gradient-primary {
  background: linear-gradient(135deg, #009FE3 0%, #35D6FF 100%);
}
```

### Dark Premium Gradient

```css
.pm-gradient-dark {
  background: linear-gradient(135deg, #061E33 0%, #0A3558 55%, #009FE3 140%);
}
```

### Water Glow

```css
.pm-water-glow {
  background: radial-gradient(circle at top right, rgba(53, 214, 255, 0.28), transparent 40%);
}
```

## Typography

Recommended fonts:
- Headlines: Sora
- Body: Inter

```css
body {
  font-family: 'Inter', sans-serif;
  color: var(--pm-slate);
  background: var(--pm-white);
}

h1, h2, h3, h4 {
  font-family: 'Sora', sans-serif;
  color: var(--pm-charcoal);
  letter-spacing: -0.03em;
}
```

## Buttons

### Primary Button

```css
.pm-button-primary {
  background: linear-gradient(135deg, #009FE3 0%, #35D6FF 100%);
  color: #FFFFFF;
  border-radius: 999px;
  font-weight: 700;
  padding: 16px 28px;
  border: none;
  box-shadow: 0 12px 30px rgba(0, 159, 227, 0.28);
}
```

### Secondary Button

```css
.pm-button-secondary {
  background: transparent;
  color: #061E33;
  border: 1px solid rgba(6, 30, 51, 0.18);
  border-radius: 999px;
  font-weight: 700;
  padding: 16px 28px;
}
```

### Dark Section Secondary Button

```css
.pm-button-secondary-dark {
  background: rgba(255,255,255,0.08);
  color: #FFFFFF;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 999px;
  font-weight: 700;
  padding: 16px 28px;
}
```

## Cards

```css
.pm-card {
  border-radius: 20px;
  background: #FFFFFF;
  box-shadow: 0 20px 50px rgba(6, 30, 51, 0.08);
  border: 1px solid rgba(6, 30, 51, 0.06);
  padding: 28px;
}
```

## Section Spacing

```css
.pm-section {
  padding: 96px 0;
}

.pm-section-tight {
  padding: 64px 0;
}

.pm-container {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
}
```

## Hero Layout

```css
.pm-hero {
  min-height: 760px;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #061E33 0%, #0A3558 55%, #009FE3 140%);
  color: #FFFFFF;
  position: relative;
  overflow: hidden;
}
```

## Badge

```css
.pm-badge {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 8px 14px;
  background: rgba(53, 214, 255, 0.12);
  color: #35D6FF;
  border: 1px solid rgba(53, 214, 255, 0.24);
  font-weight: 700;
  font-size: 14px;
}
```

## Floating Result Cards

```css
.pm-floating-card {
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  color: #061E33;
  padding: 18px 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255,255,255,0.4);
}
```

## Image Treatment

```css
.pm-image-premium {
  border-radius: 28px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.24);
  border: 1px solid rgba(255,255,255,0.2);
}
```

## General Design Rules
- Use wide spacing.
- Keep sections clean.
- Avoid clutter.
- Use high contrast.
- Use soft shadows.
- Keep cards rounded.
- Use navy for authority.
- Use aqua for energy and action.
- Use gold only for premium/status moments.
