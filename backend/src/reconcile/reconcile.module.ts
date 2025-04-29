import { Module } from '@nestjs/common';
import { ReconcileController } from './reconcile.controller';
import { ReconcileService } from './reconcile.service';

@Module({
  imports: [],
  controllers: [ReconcileController],
  providers: [ReconcileService],
})
export class ReconcileModule { }
