import { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import type { DataTablePageEvent, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';

interface Artwork {
    id: number;
    title: string;
    place_of_origin: string;
    artist_display: string;
    inscriptions: string;
    date_start: number;
    date_end: number;
}

export default function ArtTable() {
    const [rows, setRows] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState(false);

    // pagination
    const [first, setFirst] = useState(0);
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(12);
    const [totalRecords, setTotalRecords] = useState(0);

    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        setLoading(true);
        fetch(`https://api.artic.edu/api/v1/artworks?page=${page}`)
            .then(res => res.json())
            .then(json => {
                setRows(json.data);
                setTotalRecords(json.pagination.total);
            })
            .finally(() => setLoading(false));
    }, [page]);

    const onPageChange = (e: DataTablePageEvent) => {
        setFirst(e.first ?? 0);
        setPage((e.page ?? 0) + 1);
    };

    const currentSelection = rows.filter(r => selectedIds.has(r.id));

    const onSelectionChange = (e: DataTableSelectionMultipleChangeEvent<Artwork[]>) => {
        setSelectedIds(prev => {
            const copy = new Set(prev);
            e.value.forEach(row => copy.add(row.id));
            rows.forEach(row => {
                if (!e.value.includes(row) && copy.has(row.id)) {
                    copy.delete(row.id);
                }
            });
            return copy;
        });
    };

    return (
        <div className="card">
            <div style={{ marginBottom: '10px' }}>Selected: {selectedIds.size} row(s)</div>

            <DataTable
                value={rows}
                lazy
                paginator
                loading={loading}
                first={first}
                rows={rowsPerPage}
                totalRecords={totalRecords}
                onPage={onPageChange}
                selectionMode="multiple"
                selection={currentSelection}
                onSelectionChange={onSelectionChange}
                dataKey="id"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="title" header="Title" />
                <Column field="place_of_origin" header="Origin" />
                <Column field="artist_display" header="Artist" />
                <Column
                    field="inscriptions"
                    header="Inscriptions"
                    body={(row: Artwork) => row.inscriptions ? row.inscriptions : "N/A"}
                />
                <Column field="date_start" header="Start" />
                <Column field="date_end" header="End" />
            </DataTable>
        </div>
    );
}
