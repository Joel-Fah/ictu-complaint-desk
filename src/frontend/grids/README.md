# Grid Components Documentation

## ResponsiveGrid
A flexible grid layout component.

### Props:
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | required | Grid items |
| `cols` | `{ sm: number, md: number, lg: number }` | `{ sm: 1, md: 2, lg: 3 }` | Columns per breakpoint |

### Usage:
```tsx
<ResponsiveGrid cols={{ sm: 2, md: 3, lg: 4 }}>
  <div>Item 1</div>
  <div>Item 2</div>
</ResponsiveGrid>
```

## ComplaintGrid
Pre-configured grid for complaint cards.

### Data Structure:
```ts
interface Complaint {
  id: number;
  title: string;
  status: string;
  date: string;
}
```