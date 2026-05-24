
insert into storage.buckets (id, name, public)
values ('service-images', 'service-images', true)
on conflict (id) do nothing;

create policy "Service images are publicly viewable"
on storage.objects for select
using (bucket_id = 'service-images');

create policy "Users can upload their own service images"
on storage.objects for insert
with check (
  bucket_id = 'service-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own service images"
on storage.objects for update
using (
  bucket_id = 'service-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own service images"
on storage.objects for delete
using (
  bucket_id = 'service-images'
  and auth.uid()::text = (storage.foldername(name))[1]
);
