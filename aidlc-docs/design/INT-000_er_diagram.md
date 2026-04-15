erDiagram
    items {
        int         id                PK
        string      name
        string      description
        int         default_loan_days
        timestamp   created_at
    }

    members {
        int         id         PK
        string      name
        timestamp   created_at
    }

    loans {
        int         id            PK
        int         item_id       FK
        string      borrower_name
        date        loaned_at
        date        due_date
        timestamp   returned_at
        timestamp   created_at
    }

    items ||--o{ loans : "loaned"
