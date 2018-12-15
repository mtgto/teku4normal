package main

import (
	"bufio"
	"encoding/xml"
	"flag"
	"fmt"
	"io/ioutil"
	"os"
)

type feature struct {
	Keycode string `xml:"KEY_CODE"`
	// 都道府県
	Prefecture string `xml:"PREF_NAME"`
	// 市区町村
	City string `xml:"CITY_NAME"`
	// 町字コード+丁目、字などの番号
	S_area string `xml:"S_AREA"`
	// 町丁・字等名称
	S_name string `xml:"S_NAME"`
	// 特殊記号E(町丁・字等重複フラグ). "En" (n >= 1) で面積の多い順
	E string `xml:"KIGO_E"`
	// 面積(m²)
	Area float64 `xml:"AREA"`
	// 周辺長(m)
	Perimeter float64 `xml:"PERIMETER"`
	// ポリゴン. 緯度, 経度を半角スペース区切りでつなげた文字列
	Poslist string `xml:"surfaceProperty>Surface>patches>PolygonPatch>exterior>LinearRing>posList"`
}


func main() {
	flag.Parse()
	if flag.NArg() < 1 {
		fmt.Fprintf(os.Stderr, "Usage: %s <gml>", os.Args[0])
		os.Exit(1)
	}

	file, err := os.Open(flag.Arg(0))
	if err != nil {
		panic(err)
	}
	defer file.Close()
	data, err := ioutil.ReadAll(bufio.NewReader(file))
	if err != nil {
		panic(err)
	}

	var document struct {
		XMLName xml.Name `xml:"FeatureCollection"`
		Features []feature `xml:"featureMember>h27ka13"`
	}

	if err := xml.Unmarshal(data, &document); err != nil {
		panic(err)
	}
	fmt.Printf("%#v\n", document.Features)
}
