-- Lets clients subscribe to new chat messages live instead of polling.
alter publication supabase_realtime add table chat_messages;
