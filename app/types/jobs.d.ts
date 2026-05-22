interface IJobs {
    status: 'active' | 'completed' | 'pending';
    id: string;
    title: string;
    employer: string;
    employer_name: string;
    category: string;
    location: string;
    reward: number;
    type: 'Crowdsourcing' | 'Individu';
    description: string;
    requirements: string;
    taken: number;
    total: number;
    posted_at: string;
    deadline: string;
    is_saved?: boolean;
    worker_id?: string | null;
    user_id?: string | null;
    applied_at: string;
    worker_notes: notes;
    applications: Array;
}

export type { IJobs };