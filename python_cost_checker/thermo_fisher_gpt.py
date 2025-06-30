#!/usr/bin/env python3
"""
Simple ChatGPT-driven Thermo Fisher Product Cost Checker

Uses ChatGPT to provide product information and cost estimates
for Thermo Fisher Scientific products.
"""

import os
import json
import csv
from typing import List, Dict, Optional
from dataclasses import dataclass
from datetime import datetime

import pandas as pd
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

@dataclass
class ProductRequest:
    """Represents a product search request"""
    name: str
    quantity: Optional[int] = None
    catalog_number: Optional[str] = None
    additional_info: Optional[str] = None

@dataclass
class ProductResult:
    """Represents a found product with cost information"""
    search_term: str
    product_name: str
    catalog_number: str
    estimated_price: str
    description: str
    availability: str
    confidence: str
    notes: str

class ThermoFisherGPT:
    """Simple ChatGPT-based Thermo Fisher product lookup"""
    
    def __init__(self, api_key: str = None):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY environment variable.")
        
        self.client = OpenAI(api_key=self.api_key)
    
    def get_product_info(self, product_request: ProductRequest) -> ProductResult:
        """Get product information from ChatGPT"""
        
        # Build the prompt
        prompt = f"""
        You are a Thermo Fisher Scientific product expert with access to current web information. 
        Search the Thermo Fisher website for the CLOSEST matching product.
        
        Product Request:
        - Name: {product_request.name}
        - Quantity needed: {product_request.quantity or 'Not specified'}
        - Known catalog number: {product_request.catalog_number or 'Not specified'}
        - Additional info: {product_request.additional_info or 'Not specified'}
        
        SEARCH INSTRUCTIONS:
        1. Search the current Thermo Fisher Scientific website (thermofisher.com) for this product
        2. Look for exact matches first, then similar products
        3. Get current pricing from their website if available
        4. Verify catalog numbers and product details from their current catalog
        
        IMPORTANT: Always find and return the closest matching Thermo Fisher product, even if it's not an exact match. 
        Use current web search results to get accurate, up-to-date information.
        
        Search examples:
        - "DPBS" → Search "Dulbecco's Phosphate Buffered Saline site:thermofisher.com"
        - "DBS solution" → Search "DPBS Dulbecco's PBS site:thermofisher.com"
        - "PCR mix" → Search "PCR Master Mix site:thermofisher.com"
        - "Trypsin" → Search "Trypsin-EDTA site:thermofisher.com"
        
        Respond with a JSON object:
        {{
            "product_name": "The closest matching Thermo Fisher product name",
            "catalog_number": "The actual catalog/part number from their website",
            "estimated_price": "Current price from thermofisher.com or 'Contact for pricing' if not shown",
            "description": "Product description from their website",
            "availability": "Current availability status from their website",
            "confidence": "High/Medium/Low based on match quality",
            "notes": "Alternative products or additional info if relevant"
        }}
        
        Use only current information found on thermofisher.com - don't make up details.
        Always provide your best match based on live web search results.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-search-preview",  # Using search-enabled model
                messages=[{"role": "user", "content": prompt}],
                max_tokens=500,
                web_search_options={}  # Enable web search
            )
            
            # Parse the JSON response
            response_text = response.choices[0].message.content.strip()
            
            # Extract JSON from response (in case there's extra text)
            start_idx = response_text.find('{')
            end_idx = response_text.rfind('}') + 1
            json_text = response_text[start_idx:end_idx]
            
            product_data = json.loads(json_text)
            
            return ProductResult(
                search_term=product_request.name,
                product_name=product_data.get('product_name', 'Unknown'),
                catalog_number=product_data.get('catalog_number', 'N/A'),
                estimated_price=product_data.get('estimated_price', 'N/A'),
                description=product_data.get('description', 'N/A'),
                availability=product_data.get('availability', 'Unknown'),
                confidence=product_data.get('confidence', 'Unknown'),
                notes=product_data.get('notes', '')
            )
            
        except json.JSONDecodeError as e:
            return ProductResult(
                search_term=product_request.name,
                product_name="Error parsing response",
                catalog_number="N/A",
                estimated_price="N/A",
                description="Failed to parse ChatGPT response",
                availability="Unknown",
                confidence="Low",
                notes=f"JSON parse error: {str(e)}"
            )
        except Exception as e:
            return ProductResult(
                search_term=product_request.name,
                product_name="Error",
                catalog_number="N/A",
                estimated_price="N/A",
                description="Failed to get product information",
                availability="Unknown",
                confidence="Low",
                notes=f"Error: {str(e)}"
            )
    
    def process_products(self, product_requests: List[ProductRequest]) -> List[ProductResult]:
        """Process multiple product requests"""
        results = []
        
        for i, product_request in enumerate(product_requests, 1):
            print(f"Processing {i}/{len(product_requests)}: {product_request.name}")
            
            result = self.get_product_info(product_request)
            results.append(result)
            
            print(f"  → {result.product_name} ({result.catalog_number}) - {result.estimated_price}")
        
        return results
    
    def save_results(self, results: List[ProductResult], filename: str = None) -> str:
        """Save results to CSV file"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"thermo_fisher_results_{timestamp}.csv"
        
        df = pd.DataFrame([
            {
                'Search Term': result.search_term,
                'Product Name': result.product_name,
                'Catalog Number': result.catalog_number,
                'Estimated Price': result.estimated_price,
                'Description': result.description,
                'Availability': result.availability,
                'Confidence': result.confidence,
                'Notes': result.notes
            }
            for result in results
        ])
        
        df.to_csv(filename, index=False)
        print(f"\nResults saved to: {filename}")
        return filename

def load_products_from_csv(csv_file: str) -> List[ProductRequest]:
    """Load product requests from CSV file"""
    products = []
    
    try:
        df = pd.read_csv(csv_file)
        
        for _, row in df.iterrows():
            product = ProductRequest(
                name=row.get('name', row.get('product_name', '')),
                quantity=row.get('quantity', None),
                catalog_number=row.get('catalog_number', None),
                additional_info=row.get('additional_info', None)
            )
            products.append(product)
            
        return products
        
    except Exception as e:
        print(f"Error loading products from CSV: {e}")
        return []

def main():
    """Main function for command-line usage"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Simple ChatGPT-driven Thermo Fisher Product Lookup")
    parser.add_argument('--input', '-i', help='Input CSV file with product list')
    parser.add_argument('--output', '-o', help='Output CSV file for results')
    parser.add_argument('--product', '-p', help='Single product name to search')
    parser.add_argument('--api-key', help='OpenAI API key (or set OPENAI_API_KEY env var)')
    
    args = parser.parse_args()
    
    try:
        # Initialize the lookup tool
        lookup = ThermoFisherGPT(api_key=args.api_key)
        
        if args.product:
            # Single product search
            product_request = ProductRequest(name=args.product)
            result = lookup.get_product_info(product_request)
            
            print(f"\n{'='*60}")
            print(f"Results for: {result.search_term}")
            print(f"{'='*60}")
            print(f"Product Name: {result.product_name}")
            print(f"Catalog Number: {result.catalog_number}")
            print(f"Estimated Price: {result.estimated_price}")
            print(f"Description: {result.description}")
            print(f"Availability: {result.availability}")
            print(f"Confidence: {result.confidence}")
            if result.notes:
                print(f"Notes: {result.notes}")
                
        elif args.input:
            # Multiple products from CSV
            products = load_products_from_csv(args.input)
            if not products:
                print("No products found in input file")
                return
            
            print(f"\nProcessing {len(products)} products...")
            results = lookup.process_products(products)
            
            # Save results
            output_file = lookup.save_results(results, args.output)
            
            # Print summary
            high_confidence = len([r for r in results if r.confidence == 'High'])
            print(f"\nSummary:")
            print(f"Total products processed: {len(results)}")
            print(f"High confidence matches: {high_confidence}")
            print(f"Results saved to: {output_file}")
            
        else:
            print("Please provide either --product for single search or --input for batch processing")
            print("\nExamples:")
            print("  python thermo_fisher_gpt.py --product 'DPBS solution'")
            print("  python thermo_fisher_gpt.py --input products.csv --output results.csv")
            
    except ValueError as e:
        print(f"Error: {e}")
        print("Please set your OpenAI API key:")
        print("  export OPENAI_API_KEY='your-api-key-here'")
        print("  or use --api-key argument")

if __name__ == "__main__":
    main() 