import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';

/** 图片上传返回结构（与上传服务约定一致） */
export interface UploadResult {
  path: string;
  route: string;
  access_url: string;
}

/**
 * 图片上传服务 - 调用外部上传 API
 * POST /api/v1/auth/upload (multipart: fileName, file)
 * 需鉴权：Cookie auth_token 或 Authorization Bearer
 * 使用 axios + form-data，兼容 Node 16+
 */
@Injectable()
export class UploadService {
  constructor(private readonly config: ConfigService) {}

  private getUploadUrl(): string {
    const baseUrl = this.config.get<string>('upload.baseUrl') ?? 'http://localhost:8888';
    const path = this.config.get<string>('upload.path') ?? '/api/v1/auth/upload';
    return `${baseUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
  }

  /**
   * 调用外部上传服务保存图片
   * @param fileName 文件名（仅 basename，禁止含 ..）
   * @param file Multer 解析后的文件
   * @param authToken 鉴权 token（Cookie auth_token 或 Bearer）
   */
  async saveImage(
    fileName: string,
    file: Express.Multer.File,
    authToken: string,
  ): Promise<UploadResult> {
    const safeName = this.sanitizeFileName(fileName || file?.originalname || 'image');
    if (!safeName) {
      throw new BadRequestException('fileName 不合法');
    }

    const url = this.getUploadUrl();
    const formData = new FormData();
    formData.append('fileName', safeName);
    formData.append('file', file.buffer, {
      filename: safeName,
      contentType: file.mimetype,
    });

    const response = await axios.post<UploadResult>(url, formData, {
      headers: {
        ...formData.getHeaders(),
        Cookie: `auth_token=${authToken}`,
      },
      validateStatus: () => true,
    });

    if (response.status !== 200) {
      const errData = response.data as { message?: string };
      throw new BadRequestException(
        errData?.message || `上传失败: ${response.status} ${response.statusText}`,
      );
    }

    const data = response.data;
    if (!data.path || !data.access_url) {
      throw new BadRequestException('上传服务返回格式异常');
    }
    return data;
  }

  /** 仅保留 basename，去除 .. 及非法字符，保留中文 */
  private sanitizeFileName(name: string): string {
    const basename = name.replace(/^.*[/\\]/, '').replace(/\.\./g, '');
    const safe = basename.replace(/[^a-zA-Z0-9\u4e00-\u9fa5._-]/g, '_').slice(0, 128);
    if (safe && !/^_+\.?$/.test(safe)) return safe;
    const ext = basename.includes('.')
      ? basename
          .split('.')
          .pop()
          ?.replace(/[^a-zA-Z0-9]/g, '') || 'jpg'
      : 'jpg';
    return `image_${Date.now()}.${ext}`;
  }
}
