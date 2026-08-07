import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { HashUtil } from '../../common/utils/hash.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await HashUtil.hash(createUserDto.password, 12);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return user.save();
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10, search } = paginationDto;
    const baseFilter = { deletedAt: null };
    const query = search
      ? {
          ...baseFilter,
          $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }],
        }
      : baseFilter;

    const total = await this.userModel.countDocuments(query);
    const items = await this.userModel
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({ _id: id, deletedAt: null });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      updateUserDto,
      { new: true },
    );
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Soft Delete
  async remove(id: string) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: new Date() },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: 'User soft-deleted successfully' };
  }
}
