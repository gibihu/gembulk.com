<?php

namespace App\Trait;

trait GlobalStatusTrait
{

    const STATUS_UNUSED         = 0; // ไม่ใช้
    const STATUS_PENDING        = 1; // เตรียมลบ
    const STATUS_PROCESSING     = 2; // กำลังประมวลผล
    const STATUS_ERROR          = 3; // ประมวลผลล้มเหลว
    const STATUS_SUCCESS        = 4; // กำลังใช้
    const STATUS_ACTIVE         = 5; // กำลังใช้
    const STATUS_FAILED         = 6; // ประมวลผลล้มเหลว
    const STATUS_ARCHIVED       = 7; // เก็บถาวร
    const STATUS_FLAGGED        = 8; // ถูกตรวจสอบ
    const STATUS_DELETED        = 9; // ลบแล้ว

    public static $statusLabels = [
        self::STATUS_UNUSED      => 'unused',
        self::STATUS_PENDING     => 'pending',
        self::STATUS_PROCESSING  => 'processing',
        self::STATUS_SUCCESS     => 'success',
        self::STATUS_ACTIVE      => 'active',
        self::STATUS_ERROR       => 'error',
        self::STATUS_FAILED      => 'failed',
        self::STATUS_ARCHIVED    => 'archived',
        self::STATUS_FLAGGED     => 'flagged',
        self::STATUS_DELETED     => 'deleted',
    ];

    public static $statusMap = [
        'unused'     => self::STATUS_UNUSED,
        'success'    => self::STATUS_SUCCESS,
        'active'     => self::STATUS_ACTIVE,
        'pending'    => self::STATUS_PENDING,
        'deleted'    => self::STATUS_DELETED,
        'archived'   => self::STATUS_ARCHIVED,
        'processing' => self::STATUS_PROCESSING,
        'error'      => self::STATUS_ERROR,
        'failed'     => self::STATUS_FAILED,
        'flagged'    => self::STATUS_FLAGGED,
    ];

    public function getStatusTextAttribute()
    {
        return self::$statusLabels[$this->status] ?? 'Unknown status Status';
    }

    public function initializeHasStatus()
    {
        $this->append('status_text', self::STATUS_UNUSED);
    }

    public static function fromString(string $status): ?int
    {
        return self::$statusMap[strtolower($status)] ?? null;
    }
}
