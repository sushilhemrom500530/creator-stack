import { Injectable } from '@nestjs/common';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  private settings = {
    siteName: 'Creator Stack',
    maintenanceMode: false,
    supportEmail: 'support@creatorstack.com',
  };

  async getSettings() {
    return this.settings;
  }

  async updateSettings(dto: UpdateSettingsDto) {
    this.settings = { ...this.settings, ...dto };
    return this.settings;
  }
}
