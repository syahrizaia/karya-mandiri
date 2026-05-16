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
}

export type { IJobs };