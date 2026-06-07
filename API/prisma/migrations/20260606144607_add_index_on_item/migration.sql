-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateIndex
CREATE INDEX "Item_name_idx" ON "Item" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Item_shortName_idx" ON "Item" USING GIN ("shortName" gin_trgm_ops);
