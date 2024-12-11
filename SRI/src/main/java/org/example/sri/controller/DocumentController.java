package org.example.sri.controller;


import lombok.RequiredArgsConstructor;
import org.example.sri.models.Document;
import org.example.sri.repo.DocumentRepository;
import org.example.sri.service.LuceneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.print.Doc;
import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentRepository documentRepository;

    private final LuceneService luceneService;

    public DocumentController(DocumentRepository documentRepository, LuceneService luceneService) {
        this.documentRepository = documentRepository;
        this.luceneService = luceneService;
    }

    @PostMapping
    public ResponseEntity<Document> addDocument(@RequestBody Document document) throws Exception {
        // Save to MySQL
        Document savedDocument = documentRepository.save(document);

        // Index in Lucene
        luceneService.indexDocument(savedDocument);

        return ResponseEntity.ok(savedDocument);
    }
    @PostMapping("/many")
    public ResponseEntity<List<Document>> addDocuments(@RequestBody List<Document> documents) throws Exception {
        // Save to MySQL
        List<Document> savedDocuments = documentRepository.saveAll(documents);
        for(Document document : documents) {
            // Index in Lucene
            luceneService.indexDocument(document);
        }
        return ResponseEntity.ok(savedDocuments);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Document>> searchDocuments(
            @RequestParam String query,
            @RequestParam(defaultValue = "3") int maxResults,
            @RequestParam String algo
    ) throws Exception {
        // Validate the algorithm parameter
        if (!algo.equalsIgnoreCase("tfidf") && !algo.equalsIgnoreCase("bm25")) {
            return ResponseEntity.badRequest().body(null); // Respond with a 400 error for invalid input
        }

        // Call the service method with the algorithm parameter
        List<Document> searchResults = luceneService.searchDocuments(query, maxResults, algo);
        return ResponseEntity.ok(searchResults);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        return documentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/documents/{id}")
    public ResponseEntity<String> deleteDocument(@PathVariable Long id) {
        documentRepository.deleteById(id);
        try {
            luceneService.deleteDocument(id);
            return ResponseEntity.ok("Document deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting document: " + e.getMessage());
        }
    }

}