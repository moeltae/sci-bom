# Simple Thermo Fisher Product Lookup

A straightforward tool that uses ChatGPT with **live web search** to provide current Thermo Fisher Scientific product information and real pricing.

## How It Works

1. **Input**: You provide product names/descriptions
2. **ChatGPT Search**: The tool uses ChatGPT's web search to find current products on thermofisher.com
3. **Output**: Get structured results with product names, catalog numbers, and **real current pricing**

Uses OpenAI's search-enabled models to get live data from Thermo Fisher's website - no web scraping required!

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set your OpenAI API key:
```bash
export OPENAI_API_KEY="your-api-key-here"
```

## Usage

### Single Product Lookup
```bash
python thermo_fisher_gpt.py --product "DPBS solution"
```

### Batch Processing from CSV
```bash
python thermo_fisher_gpt.py --input example_products.csv --output results.csv
```

## Input Format (CSV)

```csv
name,quantity,catalog_number,additional_info
DPBS without calcium and magnesium,500,14190-144,Cell culture medium
Trypsin-EDTA 0.25%,100,,For cell detachment
PCR Master Mix,250,,High fidelity enzyme
```

Required:
- `name`: Product description

Optional:
- `quantity`: How much you need
- `catalog_number`: If you know it
- `additional_info`: Extra specifications

## Output

The tool provides:
- **Product Name**: Best matching Thermo Fisher product
- **Catalog Number**: Part number for ordering
- **Estimated Price**: Price estimate or "Contact for pricing"
- **Description**: Product description
- **Availability**: Typical lead time
- **Confidence**: How confident ChatGPT is in the match (High/Medium/Low)
- **Notes**: Additional information or alternatives

## Example Output

```
Results for: DPBS solution
==================================================
Product Name: Dulbecco's Phosphate Buffered Saline (DPBS)
Catalog Number: 14190-144
Estimated Price: $24.50
Description: 1X PBS without calcium and magnesium
Availability: In stock
Confidence: High
Notes: Also available in powder form (cat# 21600-010)
```

## Notes

- Uses `gpt-4o-search-preview` model with live web search capabilities
- **Gets real current pricing** directly from thermofisher.com when available
- Searches their website in real-time for accurate product information
- Works best with specific product descriptions
- Some products may show "Contact for pricing" when pricing isn't publicly available
- No rate limiting built in - be mindful of API usage costs 