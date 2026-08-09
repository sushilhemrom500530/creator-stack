import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto, UpdateUserDto } from './dto';
import { HashUtil } from '../../common/utils/hash.util';
import QueryBuilder from '../../common/utils/query-builder.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await HashUtil.hash(createUserDto.password, 12);
    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return user.save();
  }

  async findAll(query: Record<string, unknown>) {
    const filter = { ...query, isDeleted: false };

    const userQuery = new QueryBuilder<User>(this.userModel.find(), filter)
      .search(['name', 'email', 'roles', 'status'])
      .filter()
      .sort()
      .paginate()
      .fields();

    const [data, meta] = await Promise.all([
      userQuery.modelQuery.select('-sessions').lean().exec(),
      userQuery.countTotal(),
    ]);

    return {
      message: 'Users retrieved successfully.',
      meta,
      data,
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findOne({ _id: id, isDeleted: false }).lean().exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updateUserDto,
      { new: true },
    ).lean().exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Soft Delete
  async remove(id: string) {
    const user = await this.userModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { deletedAt: new Date(), isDeleted: true },
      { new: true },
    ).lean().exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return { message: 'User soft-deleted successfully' };
  }
}
