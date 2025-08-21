import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  async executeSeed() {
    const { data } = await axios.get<PokeResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );
    data.results.forEach(({ name, url }) => {
      const pokeId = +url.split('/').slice(-2, -1)[0];
      console.log(`Pokemon: ${name}, ID: ${pokeId}`);
    });
    return data.results;
  }
}
