import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { MongoServerError } from 'mongodb';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = configService.getOrThrow('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const createdPokemon = await this.pokemonModel.create(createPokemonDto);
      return createdPokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;
    return this.pokemonModel.find().skip(offset).limit(limit).sort({ no: 1 });
  }

  async findOne(id: string) {
    let pokemon: Pokemon | null = null;
    // NO
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: id });
    }
    // MongoId
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }
    // Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: id.toLowerCase().trim(),
      });
    }
    // Not Found
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(id);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const pokemon = await this.pokemonModel.findByIdAndDelete(id);
    if (!pokemon) {
      throw new NotFoundException(`Pokemon with id ${id} not found`);
    }
    return pokemon;
  }

  private handleExceptions(error: any) {
    if (error instanceof MongoServerError) {
      if (error.code === 11000) {
        throw new ConflictException(
          `Pokemon exists in db ${JSON.stringify(error.keyValue)}`,
        );
      }
    }
    throw new InternalServerErrorException();
  }

  async bulkInsert(pokemons: CreatePokemonDto[]) {
    if (!pokemons || pokemons.length === 0) {
      throw new ConflictException('No pokemons to insert');
    }

    try {
      await this.pokemonModel.insertMany(pokemons);
      return { message: 'Pokemons inserted successfully' };
    } catch (error) {
      this.handleExceptions(error);
    }
  }
}
