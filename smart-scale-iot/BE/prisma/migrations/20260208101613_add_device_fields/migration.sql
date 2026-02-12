-- CreateTable
CREATE TABLE "devices" (
    "id" SERIAL NOT NULL,
    "device_id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'offline',
    "cali_factor" DOUBLE PRECISION NOT NULL DEFAULT -20498.12,
    "offset" BIGINT NOT NULL DEFAULT 0,
    "last_seen" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "weight_data" (
    "id" SERIAL NOT NULL,
    "weight" DECIMAL(10,3) NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "timestamp" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "device_id" VARCHAR(100) NOT NULL,

    CONSTRAINT "weight_data_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_id_key" ON "devices"("device_id");

-- CreateIndex
CREATE INDEX "weight_data_device_id_idx" ON "weight_data"("device_id");

-- CreateIndex
CREATE INDEX "weight_data_timestamp_idx" ON "weight_data"("timestamp" DESC);

-- AddForeignKey
ALTER TABLE "weight_data" ADD CONSTRAINT "weight_data_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "devices"("device_id") ON DELETE CASCADE ON UPDATE CASCADE;
