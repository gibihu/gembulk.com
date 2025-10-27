import { Card } from '@/components/ui/card';
import { useAppearance } from '@/hooks/use-appearance';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {

    return (
        <section className='w-svw h-svh bg-accent pt-20'>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>

            <div className="w-svw flex flex-col items-center gap-4">
                <div className="p-2">
                    <span>user: GG</span>
                </div>
                <Card className="shadow-xl p-4">
                    <section className="w-4xl flex flex-col gap-4  <?= $class_card ?>">
                        <div className="grid w-full items-center gap-3">
                            <label htmlFor="senders" className="w-full  <?= $class_label ?>">รหะสผู้ส่ง</label>
                            <select name="sender" id="senders" className="w-full <?= $class_textarea ?>" required>
                                <option value="1">1</option>
                            </select>
                        </div>
                        <div className="grid w-full items-center gap-3">
                            <label htmlFor="phone" className="w-full  <?= $class_label ?>">เบอร์</label>
                            <textarea placeholder="เบอร์" id="phones" name="phones" className="w-full h-24 <?= $class_textarea ?>" required></textarea>
                        </div>
                        <div className="grid w-full items-center gap-3">
                            <label htmlFor="msg" className="  <?= $class_label ?>">ข้อความ</label>
                            <textarea placeholder="ข้อความ" id="msg" name="msg" className="w-full h-24 <?= $class_textarea ?>" required></textarea>
                            <div className="flex justify-end">
                                <label htmlFor="msg" id="count_msg" className="text-zinc-500 text-xs">0 อักษร</label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <a href="job.php" className=" <?= $class_button_outline ?>">ราการที่ต้องส่ง</a>
                            <button type="submit" id="submit" className=" <?= $class_button ?>">ยืนยัน</button>
                        </div>
                    </section>
                </Card>
            </div>
        </section>
    );
}
