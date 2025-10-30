import AppLayout from "@/layouts/app-layout";
import dash from "@/routes/dash";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import ServerTable from "./table";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Servers',
        href: dash.server.lists().url,
    },
];


export default function ServerListPage(request: any) {
    console.log(request);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={breadcrumbs[0].title} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <ServerTable items={request.servers} />
            </div>
        </AppLayout>
    );
}
