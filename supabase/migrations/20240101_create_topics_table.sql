-- Create topics table
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    category TEXT,
    duration INTEGER,
    modules INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create RLS policies for topics
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Topics are viewable by everyone"
    ON public.topics FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify topics"
    ON public.topics FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.user_id = auth.uid()
            AND profiles.is_admin = true
        )
    );

-- Create trigger for updated_at
CREATE TRIGGER update_topics_updated_at
    BEFORE UPDATE ON topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();