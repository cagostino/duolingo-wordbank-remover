# duolingo-wordbank-remover


---A chrome extension to allow users to remove the word bank on lessons so that they can actually get some practice reading and thinking about how to translate rather than just selecting the word without ever thinking about it.

---Under development. Currently have only a minimal working example which allows you to toggle a button to enter text instead of using the word bank. The way the Duolingo website appears to work requires essentially the eventual toggling of these wordbank terms in order to submit the answer. So the chrome extension captures your input and tries to match it to the words in the wordbank, finds the associated word in the bank and "clicks" it.