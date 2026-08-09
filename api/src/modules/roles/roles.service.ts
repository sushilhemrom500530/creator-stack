import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RoleSchemaClass, RoleDocument } from './schemas/role.schema';
import { CreateRoleDto } from './dto/create-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(RoleSchemaClass.name) private roleModel: Model<RoleDocument>,
  ) { }

  async create(createRoleDto: CreateRoleDto) {
    const role = new this.roleModel(createRoleDto);
    return role.save();
  }

  async findAll() {
    return this.roleModel.find().lean().exec();
  }

  async findOne(id: string) {
    const role = await this.roleModel.findById(id).lean().exec();
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return role;
  }

  async remove(id: string) {
    const role = await this.roleModel.findByIdAndDelete(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return { message: 'Role deleted successfully' };
  }
}
