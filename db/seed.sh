#!/usr/bin/env bash
mongoimport --db node --collection users --file ./users.json -jsonArray
mongoimport --db node --collection articles --file ./articles.json -jsonArray
