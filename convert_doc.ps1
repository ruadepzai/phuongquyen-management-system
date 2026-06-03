$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open("D:\WS học\TTCN\doc_temp.docx")
$doc.SaveAs2("D:\WS học\TTCN\docs_temp.txt", 2)
$doc.Close()
$word.Quit()
Write-Host "Done"
