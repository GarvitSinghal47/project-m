#include <iostream>
#include <vector>
#include <map>
#include <fstream>
#include <cstdlib>
using namespace std;

#define MIN_BALANCE 500
class insufficient_fund
{
};

class account
{
private:
    long account_number;
    string first_name;
    string last_name;
    float balance;
    static long next_account_number;

public:
    account(){};
    account(string fname, string lname, float balance);

    long get_acc_no() { return account_number; }
    string get_first_name() { return first_name; }
    string get_last_name() { return last_name; }
    float get_balance() { return balance; }

    void deposit(float amount);
    void withdraw(float amount);

    static void set_last_account_number(long account_number);
    static long get_last_account_number();

    friend ofstream &operator<<(ofstream &ofs, account &acc);
    friend ifstream &operator>>(ifstream &ifs, account &acc);
    friend ostream &operator<<(ostream &os, account &acc);
};
long account::next_account_number = 0;

class bank
{
private:
    map<long, account> accounts;

public:
    bank();
    account open_account(string fname, string lname, float balance);
    account balance_enquiry(long account_number);
    account deposit(long account_number, float amount);
    account withdraw(long account_number, float amount);
    void close_account(long account_number);
    void show_all_accounts();
    ~bank();
};

int main()
{
    bank b;
    account acc;

    int choice;
    string fname, lname;
    long account_number;
    float balance;
    float amount;

    cout << "*****banking system*****" << endl;
    do
    {
        cout << "\n\tselect one option below";
        cout << "\n\t1 open an account";
        cout << "\n\t2 balance enquiry";
        cout << "\n\t3 deposit";
        cout << "\n\t4  withdraw";
        cout << "\n\t5 close an account";
        cout << "\n\t6 show all accounts";
        cout << "\n\t7 quit\n\n\n";
        cout << "plz quit from program using 7 option  otherwise data will not be stored" << endl
             << endl;

        cout << "\n enter your choice";
        cin >> choice;
        switch (choice)
        {
        case 1:
            cout << "enter your first name";
            cin >> fname;
            cout << "enter your last name";
            cin >> lname;
            cout << "enter the initial balance";
            cin >> balance;
            acc = b.open_account(fname, lname, balance);
            cout << endl
                 << "account is created" << endl;
            cout << acc;
            break;

        case 2:
            cout << "enter your account number";
            cin >> account_number;
            acc = b.balance_enquiry(account_number);
            cout << endl
                 << "your account details" << endl;
            cout << acc;
            break;

        case 3:
            cout << "enter your account number";
            cin >> account_number;
            cout << "enter balance:";
            cin >> amount;
            acc = b.deposit(account_number, amount);
            cout << endl
                 << "Amount is Deposited" << endl;
            cout << acc;
            break;

        case 4:
            cout << "Enter Account Number:";
            cin >> account_number;
            cout << "Enter Balance:";
            cin >> amount;
            acc = b.withdraw(account_number, amount);
            cout << endl
                 << "Amount Withdrawn" << endl;
            cout << acc;
            break;

        case 5:
            cout << "Enter Account Number:";
            cin >> account_number;
            b.close_account(account_number);
            cout << endl
                 << "account is closed" << endl;
            cout << acc;
            break;

        case 6:
            b.show_all_accounts();
            break;

        case 7:
            break;

        default:
            cout << "\n enter correct choice";
            exit(0);
        }

    }

    while (choice != 7);
    return 0;
}

account::account(string fname, string lname, float balance)
{
    next_account_number++;
    account_number = next_account_number;
    first_name = fname;
    last_name = lname;
    this->balance = balance;
}

void account::deposit(float amount)
{
    balance += amount;
}
void account::withdraw(float amount)
{
    if (balance - amount < MIN_BALANCE)
        throw insufficient_fund();
    balance -= amount;
}

void account::set_last_account_number(long account_number)
{
    next_account_number = account_number;
}

long account::get_last_account_number()
{
    return next_account_number;
}

ofstream &operator<<(ofstream &ofs, account &acc)
{
    ofs << acc.account_number << endl;
    ofs << acc.first_name << endl;
    ofs << acc.last_name << endl;
    ofs << acc.balance << endl;
    return ofs;
}

ifstream &operator>>(ifstream &ifs, account &acc)
{
    ifs >> acc.account_number;

    ifs >> acc.first_name;
    ifs >> acc.last_name;
    ifs >> acc.balance;
}

ostream &operator<<(ostream &os, account &acc)
{
    os << "first name:" << acc.get_first_name() << endl;
    os << "last name:" << acc.get_last_name() << endl;
    os << "balance:" << acc.get_balance() << endl;
    return os;
}

bank::bank()
{
    account Account;
    ifstream infile;
    infile.open("bank.data");
    if (!infile)
    {
        // cout<<"error opening";
        return;
    }
    //eof represent when the expression is true do this
    while (!infile.eof())
    {
        //here account with uooer cse is created as we have already define small case account earlier for different purpose
        infile >> Account;
        accounts.insert(pair<long, account>(Account.get_acc_no(), Account));
    }
    account::set_last_account_number(Account.get_acc_no());
    infile.close();
}

account bank::open_account(string fname, string lname, float balance)
{
    ofstream outfile;
    account Account(fname, lname, balance);
    accounts.insert(pair<long, account>(Account.get_acc_no(), Account));
    outfile.open("bank.data", ios::trunc);
    map<long, account>::iterator itr;
    for (itr = accounts.begin(); itr != accounts.end(); itr++)
    {
        outfile << itr->second;
    }
    outfile.close();
    return Account;
}

account bank::balance_enquiry(long account_number)
{
    map<long, account>::iterator itr = accounts.find(account_number);
    return itr->second;
}
account bank::deposit(long account_number, float amount)
{
    map<long, account>::iterator itr = accounts.find(account_number);
    itr->second.deposit(amount);
    return itr->second;
}
account bank::withdraw(long account_number, float amount)
{
    map<long, account>::iterator itr = accounts.find(account_number);
    itr->second.withdraw(amount);
    return itr->second;
}
void bank::close_account(long account_number)
{
    map<long, account>::iterator itr = accounts.find(account_number);
    cout << "Account Deleted" << itr->second;
    accounts.erase(account_number);
}
void bank::show_all_accounts()
{
    map<long, account>::iterator itr;
    for (itr = accounts.begin(); itr != accounts.end(); itr++)
    {
        cout << "Account " << itr->first << endl
             << itr->second << endl;
    }
}
bank::~bank()
{
    ofstream outfile;
    outfile.open("bank.data", ios::trunc);
    map<long, account>::iterator itr;
    for (itr = accounts.begin(); itr != accounts.end(); itr++)
    {
        outfile << itr->second;
    }
    outfile.close();
}

//itr->second is use to get second element off the map
