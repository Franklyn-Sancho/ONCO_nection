import cron from 'node-cron';
import { userService } from '../config/providers';


cron.schedule('0 0 * * *', async () => { // Executa diariamente à meia-noite
  try {
    await userService.processScheduledDeletions();
    console.log('Scheduled deletions processed.');
  } catch (error) {
    console.error('Error processing scheduled deletions:', error);
  }
});

