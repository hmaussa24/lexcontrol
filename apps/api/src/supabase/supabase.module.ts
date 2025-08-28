import { Global, Module } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE = 'SUPABASE_CLIENT';

@Global()
@Module({
  providers: [
    {
      provide: SUPABASE,
      useFactory: (): SupabaseClient => {
        const url = process.env.SUPABASE_URL ?? '';
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';
        return createClient(url, key);
      },
    },
  ],
  exports: [SUPABASE],
})
export class SupabaseModule {}


