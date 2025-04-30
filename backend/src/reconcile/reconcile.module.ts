import { Module } from '@nestjs/common';
import { ReconcileController } from './reconcile.controller';
import { ReconcileService } from './reconcile.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ReconcileController],
  providers: [ReconcileService],
})
export class ReconcileModule { }
