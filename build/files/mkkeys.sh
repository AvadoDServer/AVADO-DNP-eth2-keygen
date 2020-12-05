#!/usr/bin/expect -f

set LANGUAGE [lindex $argv 0]
set PASSWORD [lindex $argv 1]
set NUM_VALIDATORS [lindex $argv 2] 
set timeout -1
set mnemonic {}
 
spawn /usr/bin/deposit new-mnemonic --num_validators $NUM_VALIDATORS --chain mainnet
 
expect "Please choose your mnemonic language " { send "$LANGUAGE\r" }

expect "Type the password that secures your validator keystore(s): " {
	sleep 1
	send "$PASSWORD\r"
}

expect "Repeat for confirmation:" {
	sleep 1
	send "$PASSWORD\r"
}

expect {
 -re "This is your seed phrase. Write it down and store it safely, it is the ONLY way to retrieve your deposit.(.*)Press any key when you have written down your mnemonic." {
   sleep 1   
   set mnemonic  $expect_out(1,string)
   puts "Mnemonic $mnemonic"
   send "\n"
   sleep 1 
 }
}

expect {
 "Please type your mnemonic (separated by spaces) to confirm you have written it down" {
   sleep 1
   send "$mnemonic \n"
 }
}

expect {
 "Press any key." {
   send "\n"
 }
}

# Save mnemonic
set MNEMONIC_OUTFILE "validator_keys/mnemonic.txt"
set CHAN [open $MNEMONIC_OUTFILE w]
puts $CHAN $mnemonic
close $CHAN

# Save password
set PASSWORD_OUTFILE "validator_keys/password.txt"
set CHAN [open $PASSWORD_OUTFILE w]
puts $CHAN $PASSWORD
close $CHAN
