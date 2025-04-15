# ROAS Calculator

A modern, interactive ROAS (Return on Investment) calculator built with Next.js and React. This application allows users to visualize potential cost savings and revenue improvements through an intuitive, responsive interface.

## Features

- **Interactive Sliders**: Adjust ad spend and revenue values with responsive, touch-friendly sliders
- **Real-time Calculations**: Instantly see how changes affect your ROAS metrics
- **Visual Comparisons**: Clear visual representation of current vs. improved metrics
- **Responsive Design**: Fully responsive for all device sizes
- **Accessibility**: ARIA-compliant interactive elements

## Live Demo

Try out the ROAS Calculator: [https://roas-calculator-fn76.vercel.app/](https://roas-calculator-fn76.vercel.app/)

## Installation

### Prerequisites

- Node.js 16.x or higher
- npm or yarn

### Setup

1. Clone the repository:

```bash
git clone https://github.com/dali-benothmen/roas-calculator.git
cd roas-calculator
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
roas-calculator/
├── app/                        # Next.js app directory
│   ├── components/             # App-specific components
│   │   ├── calculator/         # Calculator feature components
│   │   │   ├── Calculator.tsx  # Main calculator component
│   │   │   ├── MetricsCard.tsx # Metrics comparison card
│   │   │   ├── MonthlySavings.tsx # Monthly savings component
│   │   │   ├── RoasDisplay.tsx # ROAS display component
│   │   │   ├── index.ts        # Barrel file for exports
│   │   │   └── styles.css      # Calculator-specific styles
│   │   └── Calculator.tsx      # Re-export file
│   ├── lib/                    # Library code
│   │   └── components/         # Shared UI components
│   │       └── Slider.tsx      # Reusable slider component
│   ├── utils/                  # Utility functions
│   │   ├── calculatorUtils.ts  # Calculator-specific calculations
│   │   └── formatters.ts       # Formatting utilities
│   ├── layout.tsx              # Main app layout
│   └── page.tsx                # Main page component
├── public/                     # Static assets
├── README.md                   # Project documentation
├── package.json                # Project dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## Architecture

The project follows a modular component architecture designed for maintainability and reusability.

### Key Components

#### Slider (`app/lib/components/Slider.tsx`)

A reusable slider component that handles:

- Dragging interactions (mouse and touch)
- Keyboard navigation for accessibility
- Value snapping to predetermined points
- Visual feedback for user interactions

```tsx
<Slider
  value={adSpend}
  onChange={setAdSpend}
  min={0}
  max={500000}
  step={5000}
  label="Ad Spend Slider"
  formatValue={(val) => val.toLocaleString()}
  snapPoints={[125000, 250000, 375000]}
/>
```

#### MetricsCard (`app/components/calculator/MetricsCard.tsx`)

Displays comparison metrics between current and improved values:

- Title and difference amount
- Visual representation of current vs. improved values
- Formatted values with proper currency/number formatting

```tsx
<MetricsCard
  title="Ad Spend"
  difference={formatCurrency(adSpendSavings)}
  isPositive={false}
  currentLabel="Your current Ad Spend"
  currentValue={formatCurrency(adSpend)}
  currentWidth={adSpendBarWidths.currentWidth}
  improvedValue={formatCurrency(improvedAdSpend)}
  improvedWidth={adSpendBarWidths.improvedWidth}
/>
```

#### Calculator (`app/components/calculator/Calculator.tsx`)

The main calculator component that:

- Manages state for ad spend and revenue
- Calculates derived values (ROAS, savings, etc.)
- Orchestrates the UI components
- Handles user interaction logic

### Utility Functions

The application utilizes two sets of utility functions:

#### Formatters (`app/utils/formatters.ts`)

Handle data formatting for display:

- `formatCurrency`: Format numbers as USD currency strings
- `formatRoas`: Format ROAS values with appropriate decimal precision

#### Calculator Utilities (`app/utils/calculatorUtils.ts`)

Handle business logic calculations:

- Calculate improved metrics based on current values
- Determine savings and gains
- Apply business-specific formulas

## Development

### Adding New Features

1. For new UI components:

   - Place shared/reusable components in `app/lib/components/`
   - Place feature-specific components in their feature folder (e.g., `app/components/calculator/`)

2. For new utility functions:
   - Add general utilities to `app/utils/formatters.ts`
   - Add calculator-specific calculations to `app/utils/calculatorUtils.ts`

### Styling

The project uses a combination of:

- Inline Tailwind CSS for component-specific styling
- CSS modules for reusable styles and animations

## License

[MIT](LICENSE)

## Contact

For questions or feedback, please contact [your-email@example.com](mailto:your-email@example.com)
