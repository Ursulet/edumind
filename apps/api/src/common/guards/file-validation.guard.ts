import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class FileValidationGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    // In NestJS, uploaded files are typically available on request.file or request.files
    const file = (request as any).file;
    const files = (request as any).files;

    const allFiles = [];
    if (file) allFiles.push(file);
    if (files && Array.isArray(files)) allFiles.push(...files);
    
    // If there are no files, pass the guard
    if (allFiles.length === 0) return true;

    const allowedMimeTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    for (const f of allFiles) {
      if (!allowedMimeTypes.includes(f.mimetype)) {
        throw new BadRequestException(`File type ${f.mimetype} is not allowed. Only PDF, JPEG, PNG and DOCX are accepted.`);
      }

      if (f.size > maxSizeBytes) {
        throw new BadRequestException(`File size exceeds the 10MB limit.`);
      }
    }

    return true;
  }
}
