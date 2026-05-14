interface IJobs {
    status: 'active' | 'completed' | 'pending';
    id: string;
    title: string;
    employer: string;
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
}

export type { IJobs };