import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { State, StateDocument } from './schemas/state.schema';
import { CountriesService } from '../countries/countries.service';

@Injectable()
export class StatesService {
  constructor(
    @InjectModel(State.name)
    private stateModel: Model<StateDocument>,
    private countriesService: CountriesService,
  ) {}

  async findAll(countryId?: string) {
    const query: any = {};

    if (countryId) {
      // Validate country exists
      const country = await this.countriesService.findById(countryId);
      if (!country) {
        throw new NotFoundException(`Country with ID ${countryId} not found`);
      }

      // Build query to match state with country using multiple methods
      const $or: any[] = [];

      // Method 1: Check countryId (ObjectId)
      $or.push({ countryId: new Types.ObjectId(countryId) });

      // Method 2: Check country_id (integer) if country has id field
      if ((country as any).id) {
        $or.push({ country_id: (country as any).id });
      }

      // Method 3: Check country_code
      const countryCode = (country as any).country_code || country.countryCode;
      if (countryCode) {
        $or.push({ country_code: countryCode });
      }

      // If we have any conditions, use them
      if ($or.length > 0) {
        query.$or = $or;
      } else {
        // If no matching method found, return empty result
        return [];
      }
    }

    return this.stateModel.find(query).sort({ stateName: 1 }).exec();
  }

  async findById(id: string) {
    return this.stateModel.findById(id).exec();
  }

  async searchByName(
    stateName: string,
    countryId?: string,
  ): Promise<StateDocument[]> {
    try {
      if (!stateName || stateName.trim() === '') {
        return [];
      }

      const searchTerm = stateName.trim();
      console.log('[State Search] Searching for:', searchTerm);
      console.log('[State Search] Country ID filter:', countryId);

      // Debug: Check what fields exist in the database and total count
      const totalCount = await this.stateModel.countDocuments().exec();
      console.log('[State Search] Total states in database:', totalCount);

      const sampleState = await this.stateModel.findOne().exec();
      if (sampleState) {
        const sampleObj = sampleState.toObject();
        console.log(
          '[State Search] Sample state document:',
          JSON.stringify(sampleObj, null, 2),
        );
        console.log('[State Search] Available fields:', Object.keys(sampleObj));
        console.log('[State Search] stateName value:', sampleObj.stateName);
        console.log('[State Search] name value:', (sampleObj as any).name);
        console.log(
          '[State Search] state_name value:',
          (sampleObj as any).state_name,
        );
      } else {
        console.log(
          '[State Search] WARNING: No states found in database at all!',
        );
        return [];
      }

      // Build base country filter if provided
      let countryFilter: any = null;
      if (countryId) {
        try {
          const country = await this.countriesService.findById(countryId);
          if (country) {
            const countryConditions: any[] = [];
            countryConditions.push({
              countryId: new Types.ObjectId(countryId),
            });

            if ((country as any).id) {
              countryConditions.push({ country_id: (country as any).id });
            }

            const countryCode =
              (country as any).country_code || country.countryCode;
            if (countryCode) {
              countryConditions.push({ country_code: countryCode });
            }

            if (countryConditions.length > 0) {
              countryFilter = { $or: countryConditions };
            }
          } else {
            console.log(
              '[State Search] Country not found, returning empty results',
            );
            return [];
          }
        } catch (error: any) {
          console.error('[State Search] Error fetching country:', error);
          // Continue without country filter if there's an error
        }
      }

      // Strategy 1: Try exact match (case-insensitive) on stateName
      let query: any = {
        stateName: new RegExp(`^${this.escapeRegex(searchTerm)}$`, 'i'),
      };
      if (countryFilter) {
        query = { $and: [query, countryFilter] };
      }

      let results = await this.stateModel
        .find(query)
        .sort({ stateName: 1 })
        .exec();

      // If no results, try alternative field names
      if (results.length === 0) {
        // Try with name field (if it exists)
        query = { name: new RegExp(`^${this.escapeRegex(searchTerm)}$`, 'i') };
        if (countryFilter) {
          query = { $and: [query, countryFilter] };
        }
        results = await this.stateModel.find(query).sort({ name: 1 }).exec();
      }

      if (results.length === 0) {
        // Try with state_name field (snake_case)
        query = {
          state_name: new RegExp(`^${this.escapeRegex(searchTerm)}$`, 'i'),
        };
        if (countryFilter) {
          query = { $and: [query, countryFilter] };
        }
        results = await this.stateModel
          .find(query)
          .sort({ state_name: 1 })
          .exec();
      }

      if (results.length > 0) {
        console.log('[State Search] Found', results.length, 'exact matches');
        return results;
      }

      // Strategy 2: Try partial match (contains search term)
      const escapedSearchTerm = this.escapeRegex(searchTerm);
      const partialRegex = new RegExp(escapedSearchTerm, 'i');

      // Try multiple field names
      const searchFields = [
        { stateName: partialRegex },
        { name: partialRegex },
        { state_name: partialRegex },
      ];

      for (const fieldQuery of searchFields) {
        query = fieldQuery;
        if (countryFilter) {
          query = { $and: [query, countryFilter] };
        }

        results = await this.stateModel
          .find(query)
          .sort({ stateName: 1 })
          .exec();

        if (results.length > 0) {
          console.log(
            '[State Search] Found',
            results.length,
            'partial matches using field:',
            Object.keys(fieldQuery)[0],
          );
          break;
        }
      }

      if (results.length > 0) {
        console.log('[State Search] Found', results.length, 'partial matches');
        return results;
      }

      // Strategy 3: Try fuzzy matching - split search term and try each word
      const words = searchTerm.split(/\s+/).filter((w) => w.length > 2);
      if (words.length > 0) {
        const wordRegexes = words.map(
          (word) => new RegExp(this.escapeRegex(word), 'i'),
        );
        // Try multiple field names
        const fieldNames = ['stateName', 'name', 'state_name'];

        for (const fieldName of fieldNames) {
          const orConditions = wordRegexes.map((regex) => ({
            [fieldName]: regex,
          }));
          query = { $or: orConditions };
          if (countryFilter) {
            query = { $and: [query, countryFilter] };
          }

          results = await this.stateModel
            .find(query)
            .sort({ stateName: 1 })
            .exec();

          if (results.length > 0) {
            console.log(
              '[State Search] Found',
              results.length,
              'word-based matches using field:',
              fieldName,
            );
            return results;
          }
        }
      }

      // Strategy 4: Try with common variations
      const variations = this.generateSearchVariations(searchTerm);
      const variationRegexes = variations.map(
        (v) => new RegExp(this.escapeRegex(v), 'i'),
      );

      // Try multiple field names
      const fieldNames = ['stateName', 'name', 'state_name'];
      for (const fieldName of fieldNames) {
        const variationConditions = variationRegexes.map((regex) => ({
          [fieldName]: regex,
        }));
        query = { $or: variationConditions };
        if (countryFilter) {
          query = { $and: [query, countryFilter] };
        }

        results = await this.stateModel
          .find(query)
          .sort({ stateName: 1 })
          .exec();

        if (results.length > 0) {
          console.log(
            '[State Search] Found',
            results.length,
            'variation matches using field:',
            fieldName,
          );
          break;
        }
      }

      if (results.length > 0) {
        console.log(
          '[State Search] Found',
          results.length,
          'variation matches',
        );
        return results;
      }

      // Strategy 5: Try character-based similarity
      const allStates = await this.stateModel
        .find(countryFilter || {})
        .sort({ stateName: 1 })
        .exec();
      const similarStates = allStates
        .map((state) => {
          // Try multiple field names for similarity
          const stateObj = state.toObject();
          const stateNameValue =
            stateObj.stateName ||
            (stateObj as any).name ||
            (stateObj as any).state_name ||
            '';
          const stateNameLower = stateNameValue.toLowerCase();
          return {
            state,
            similarity: this.calculateSimilarity(
              searchTerm.toLowerCase(),
              stateNameLower,
            ),
          };
        })
        .filter((item) => item.similarity > 0.6) // 60% similarity threshold
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 10) // Top 10 most similar
        .map((item) => item.state);

      if (similarStates.length > 0) {
        console.log(
          '[State Search] Found',
          similarStates.length,
          'similar matches',
        );
        return similarStates;
      }

      console.log('[State Search] No matches found');
      return [];
    } catch (error: any) {
      console.error('[State Search] Error:', error);
      console.error('[State Search] Error stack:', error.stack);
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
    const suffixes = ['state', 'states', 'province', 'region'];
    for (const suffix of suffixes) {
      if (lowerTerm.endsWith(suffix)) {
        variations.push(term.substring(0, term.length - suffix.length).trim());
      }
    }

    // Handle common typos/variations for specific terms
    const commonVariations: { [key: string]: string[] } = {
      telangana: ['telengana', 'telengana', 'telangana'],
      maharashtra: ['maharasthra', 'maharastra'],
      karnataka: ['karnatka', 'karnatak'],
      'tamil nadu': ['tamilnadu', 'tamil nadu'],
      'west bengal': ['westbengal', 'west bengal'],
      'uttar pradesh': ['uttarpradesh', 'up'],
      'andhra pradesh': ['andhrapradesh', 'ap'],
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
      console.error('[State Search] Similarity calculation error:', error);
      return 0;
    }
  }
}
