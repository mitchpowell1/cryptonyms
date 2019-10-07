package main

import (
	"io/ioutil"
	"strings"
	"sync"
)

func loadLexicon(filePath string) ([]string, error) {
	fileBytes, err := ioutil.ReadFile(filePath)
	if err != nil {
		return nil, err
	}
	fileString := string(fileBytes)
	return strings.Split(fileString, "\n"), nil
}

func LoadLexicons(lexiconDirectory string) (map[string][]string, error) {
	var wg sync.WaitGroup
	files, err := ioutil.ReadDir(lexiconDirectory)

	lexiconMap := make(map[string][]string)

	if err != nil {
		return nil, err
	}

	for _, file := range files {
		wg.Add(1)
		go func(fileName string) {
			defer wg.Done()
			filePath := lexiconDirectory + "/" + fileName
			lexiconWords, _ := loadLexicon(filePath)
			lexiconMap[fileName] = lexiconWords
		}(file.Name())
	}

	wg.Wait()

	return lexiconMap, nil
}
