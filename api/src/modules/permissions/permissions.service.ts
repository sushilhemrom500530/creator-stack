import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  private permissions: { id: string; name: string; description: string }[] = [
    { id: '1', name: 'users:read', description: 'Read user information' },
    { id: '2', name: 'users:write', description: 'Create or update users' },
    { id: '3', name: 'products:read', description: 'Read product catalog' },
    { id: '4', name: 'products:write', description: 'Manage products' },
  ];

  async create(createPermissionDto: CreatePermissionDto) {
    const newPerm = {
      id: String(this.permissions.length + 1),
      ...createPermissionDto,
    };
    this.permissions.push(newPerm);
    return newPerm;
  }

  async findAll() {
    return this.permissions;
  }

  async findOne(id: string) {
    return this.permissions.find((p) => p.id === id);
  }
}
