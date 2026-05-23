-- Adicionar campos member_type e is_featured
ALTER TABLE staff_members 
ADD COLUMN member_type TEXT DEFAULT 'therapist',
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Criar índice para melhorar performance de queries
CREATE INDEX idx_staff_members_type ON staff_members(member_type);
CREATE INDEX idx_staff_members_featured ON staff_members(is_featured);