# Transactions

EdgeQL supports atomic transactions. The transaction API consists of several commands:

## Client libraries

There is rarely a reason to use these commands directly. All Gel client libraries provide dedicated transaction APIs that handle transaction creation under the hood.

Examples below show a transaction that sends 10 cents from the account of a BankCustomer called 'Customer1' to BankCustomer called 'Customer2'. The equivalent Gel schema and queries are:

```default
module default {
  type BankCustomer {
    required name: str;
    required balance: int64;
  }
}
update BankCustomer
    filter .name = 'Customer1'
    set { bank_balance := .bank_balance -10 };
update BankCustomer
    filter .name = 'Customer2'
    set { bank_balance := .bank_balance +10 }
```

