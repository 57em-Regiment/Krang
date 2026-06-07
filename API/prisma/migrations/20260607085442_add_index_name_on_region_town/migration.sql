-- CreateIndex
CREATE INDEX "Region_name_idx" ON "Region" USING GIN ("name" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Town_name_idx" ON "Town" USING GIN ("name" gin_trgm_ops);
