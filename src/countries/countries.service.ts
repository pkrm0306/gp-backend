import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Country, CountryDocument } from './schemas/country.schema';

@Injectable()
export class CountriesService {
  constructor(
    @InjectModel(Country.name)
    private countryModel: Model<CountryDocument>,
  ) {}

  async findAll() {
    return this.countryModel.find().sort({ countryName: 1 }).exec();
  }

  async findById(id: string): Promise<CountryDocument | null> {
    return this.countryModel.findById(id).exec();
  }

  async searchByName(countryName: string): Promise<CountryDocument[]> {
    try {
      if (!countryName || countryName.trim() === '') {
        return [];
      }
      
      const searchTerm = countryName.trim();
      console.log('[Country Search] Searching for:', searchTerm);
      
      // Debug: Check what fields exist in the database and total count
      const totalCount = await this.countryModel.countDocuments().exec();
      console.log('[Country Search] Total countries in database:', totalCount);
      
      const sampleCountry = await this.countryModel.findOne().exec();
      if (sampleCountry) {
        const sampleObj = sampleCountry.toObject();
        console.log('[Country Search] Sample country document:', JSON.stringify(sampleObj, null, 2));
        console.log('[Country Search] Available fields:', Object.keys(sampleObj));
        console.log('[Country Search] countryName value:', sampleObj.countryName);
        console.log('[Country Search] name value:', (sampleObj as any).name);
        console.log('[Country Search] country_name value:', (sampleObj as any).country_name);
      } else {
        console.log('[Country Search] WARNING: No countries found in database at all!');
        return [];
      }
      
      // Strategy 1: Try exact match (case-insensitive) on countryName
      let results = await this.countryModel
        .find({ countryName: new RegExp(`^${this.escapeRegex(searchTerm)}$`, 'i') })
        .sort({ countryName: 1 })
        .exec();
      
      // If no results, try alternative field names
      if (results.length === 0) {
        // Try with name field (if it exists)
        results = await this.countryModel
          .find({ name: new RegExp(`^${this.escapeRegex(searchTerm)}$`, 'i') })
          .sort({ name: 1 })
          .exec();
      }
      
      if (results.length === 0) {
        // Try with country_name field (snake_case)
        results = await this.countryModel
          .find({ country_name: new RegExp(`^${this.escapeRegex(searchTerm)}$`, 'i') })
          .sort({ country_name: 1 })
          .exec();
      }
      
      if (results.length > 0) {
        console.log('[Country Search] Found', results.length, 'exact matches');
        return results;
      }
      
      // Strategy 2: Try partial match (contains search term)
      const escapedSearchTerm = this.escapeRegex(searchTerm);
      const partialRegex = new RegExp(escapedSearchTerm, 'i');
      
      // Try multiple field names
      const searchFields = [
        { countryName: partialRegex },
        { name: partialRegex },
        { country_name: partialRegex },
      ];
      
      for (const fieldQuery of searchFields) {
        results = await this.countryModel
          .find(fieldQuery)
          .sort({ countryName: 1 })
          .exec();
        
        if (results.length > 0) {
          console.log('[Country Search] Found', results.length, 'partial matches using field:', Object.keys(fieldQuery)[0]);
          break;
        }
      }
      
      if (results.length > 0) {
        console.log('[Country Search] Found', results.length, 'partial matches');
        return results;
      }
      
      // Strategy 3: Try fuzzy matching - split search term and try each word
      const words = searchTerm.split(/\s+/).filter(w => w.length > 2); // Only words longer than 2 chars
      if (words.length > 0) {
        // Use $or with each word
        const wordRegexes = words.map(word => new RegExp(this.escapeRegex(word), 'i'));
        const orConditions = wordRegexes.map(regex => ({ countryName: regex }));
        results = await this.countryModel
          .find({ $or: orConditions })
          .sort({ countryName: 1 })
          .exec();
        
        if (results.length > 0) {
          console.log('[Country Search] Found', results.length, 'word-based matches');
          return results;
        }
      }
      
      // Strategy 4: Try with common variations (remove common suffixes, handle common typos)
      const variations = this.generateSearchVariations(searchTerm);
      const variationRegexes = variations.map(v => new RegExp(this.escapeRegex(v), 'i'));
      const variationConditions = variationRegexes.map(regex => ({ countryName: regex }));
      
      if (variationConditions.length > 0) {
        results = await this.countryModel
          .find({ $or: variationConditions })
          .sort({ countryName: 1 })
          .exec();
        
        if (results.length > 0) {
          console.log('[Country Search] Found', results.length, 'variation matches');
          return results;
        }
      }
      
      // Strategy 5: Try character-based similarity (simple approach)
      // Get all countries and calculate similarity
      const allCountries = await this.countryModel.find().sort({ countryName: 1 }).exec();
      const similarCountries = allCountries
        .map(country => {
          const countryNameLower = (country.countryName || '').toLowerCase();
          return {
            country,
            similarity: this.calculateSimilarity(searchTerm.toLowerCase(), countryNameLower),
          };
        })
        .filter(item => item.similarity > 0.6) // 60% similarity threshold
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 10) // Top 10 most similar
        .map(item => item.country);
      
      if (similarCountries.length > 0) {
        console.log('[Country Search] Found', similarCountries.length, 'similar matches');
        return similarCountries;
      }
      
      console.log('[Country Search] No matches found');
      return [];
    } catch (error: any) {
      console.error('[Country Search] Error:', error);
      console.error('[Country Search] Error stack:', error.stack);
      throw error;
    }
  }

  private escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private generateSearchVariations(term: string): string[] {
    const variations: string[] = [];
    const lowerTerm = term.toLowerCase();
    
    // Add original
    variations.push(term);
    
    // Remove common suffixes
    const suffixes = ['country', 'nation', 'republic', 'kingdom', 'state', 'states'];
    for (const suffix of suffixes) {
      if (lowerTerm.endsWith(suffix)) {
        variations.push(term.substring(0, term.length - suffix.length).trim());
      }
    }
    
    // Handle common typos/variations for specific terms
    const commonVariations: { [key: string]: string[] } = {
      'india': ['indian', 'hindustan'],
      'usa': ['united states', 'america', 'us'],
      'uk': ['united kingdom', 'britain', 'england'],
      'telangana': ['telengana', 'telengana'],
    };
    
    if (commonVariations[lowerTerm]) {
      variations.push(...commonVariations[lowerTerm]);
    }
    
    return [...new Set(variations)]; // Remove duplicates
  }

  private calculateSimilarity(str1: string, str2: string): number {
    try {
      if (!str1 || !str2) return 0;
      
      // Simple Levenshtein-like similarity calculation
      const longer = str1.length > str2.length ? str1 : str2;
      const shorter = str1.length > str2.length ? str2 : str1;
      
      if (longer.length === 0) return 1.0;
      
      // Check if one contains the other
      if (longer.includes(shorter)) {
        return shorter.length / longer.length;
      }
      
      // Simple character-based similarity
      let matches = 0;
      const shorterChars = shorter.split('');
      const longerChars = longer.split('');
      
      for (const char of shorterChars) {
        if (longerChars.includes(char)) {
          matches++;
          const index = longerChars.indexOf(char);
          longerChars.splice(index, 1);
        }
      }
      
      return matches / longer.length;
    } catch (error) {
      console.error('[Country Search] Similarity calculation error:', error);
      return 0;
    }
  }
}
