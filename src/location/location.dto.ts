import { Status } from '@prisma/client';

export class CreateLocationDto {
  name: string;
  title: string;
  lat: string;
  long: string;
  status: Status;
}

export class DeleteLocationDto {
  name: string;
}