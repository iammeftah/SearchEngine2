package org.example.sri.service;

import org.apache.lucene.analysis.standard.StandardAnalyzer;
import org.apache.lucene.document.Field;
import org.apache.lucene.document.StringField;
import org.apache.lucene.document.TextField;
import org.apache.lucene.index.*;
import org.apache.lucene.queryparser.classic.QueryParser;
import org.apache.lucene.search.IndexSearcher;
import org.apache.lucene.search.Query;
import org.apache.lucene.search.ScoreDoc;
import org.apache.lucene.search.TopDocs;
import org.apache.lucene.search.similarities.BM25Similarity;
import org.apache.lucene.search.similarities.ClassicSimilarity;
import org.apache.lucene.search.similarities.Similarity;
import org.apache.lucene.store.Directory;
import org.apache.lucene.store.FSDirectory;
import org.example.sri.models.Document;
import org.example.sri.repo.DocumentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class LuceneService {

    private final DocumentRepository documentRepository;
    private final Directory bm25IndexDirectory;
    private final Directory tfidfIndexDirectory;
    private final StandardAnalyzer analyzer;

    public LuceneService(
            DocumentRepository documentRepository,
            @Value("${lucene.index.bm25.path:./lucene-bm25-index}") String bm25IndexPath,
            @Value("${lucene.index.tfidf.path:./lucene-tfidf-index}") String tfidfIndexPath
    ) throws IOException {
        this.documentRepository = documentRepository;

        // Initialize directories
        this.bm25IndexDirectory = FSDirectory.open(Paths.get(bm25IndexPath));
        this.tfidfIndexDirectory = FSDirectory.open(Paths.get(tfidfIndexPath));
        Files.createDirectories(Paths.get(bm25IndexPath));
        Files.createDirectories(Paths.get(tfidfIndexPath));

        this.analyzer = new StandardAnalyzer();

        // Initialize both indices
        initializeIndex(this.bm25IndexDirectory, new BM25Similarity());
        initializeIndex(this.tfidfIndexDirectory, new ClassicSimilarity());
    }

    private void initializeIndex(Directory directory, Similarity similarity) throws IOException {
        try (IndexReader reader = DirectoryReader.open(directory)) {
            if (reader.numDocs() == 0) {
                reindexAllDocuments(directory, similarity);
            }
        } catch (IOException e) {
            reindexAllDocuments(directory, similarity);
        }
    }

    public void reindexAllDocuments(Directory directory, Similarity similarity) throws IOException {
        IndexWriterConfig config = new IndexWriterConfig(analyzer);
        config.setSimilarity(similarity);
        config.setOpenMode(IndexWriterConfig.OpenMode.CREATE);

        try (IndexWriter writer = new IndexWriter(directory, config)) {
            List<Document> allDocuments = documentRepository.findAll();

            for (Document document : allDocuments) {
                org.apache.lucene.document.Document luceneDoc = new org.apache.lucene.document.Document();

                luceneDoc.add(new StringField("id", document.getId().toString(), Field.Store.YES));
                luceneDoc.add(new TextField("title", document.getTitle(), Field.Store.YES));
                luceneDoc.add(new TextField("text", document.getText(), Field.Store.YES));

                writer.addDocument(luceneDoc);
            }
            writer.commit();
        }
    }

    public void indexDocument(Document document) throws IOException {
        indexDocumentInDirectory(document, bm25IndexDirectory, new BM25Similarity());
        indexDocumentInDirectory(document, tfidfIndexDirectory, new ClassicSimilarity());
    }

    private void indexDocumentInDirectory(Document document, Directory directory, Similarity similarity) throws IOException {
        IndexWriterConfig config = new IndexWriterConfig(analyzer);
        config.setSimilarity(similarity);

        try (IndexWriter writer = new IndexWriter(directory, config)) {
            org.apache.lucene.document.Document luceneDoc = new org.apache.lucene.document.Document();

            luceneDoc.add(new StringField("id", document.getId().toString(), Field.Store.YES));
            luceneDoc.add(new TextField("title", document.getTitle(), Field.Store.YES));
            luceneDoc.add(new TextField("text", document.getText(), Field.Store.YES));

            writer.addDocument(luceneDoc);
        }
    }

    public List<Document> searchDocuments(String queryString, int maxResults, String similarityType) throws Exception {
        Directory directory = similarityType.equalsIgnoreCase("bm25") ? bm25IndexDirectory : tfidfIndexDirectory;

        try (IndexReader reader = DirectoryReader.open(directory)) {
            IndexSearcher searcher = new IndexSearcher(reader);

            if (similarityType.equalsIgnoreCase("bm25")) {
                searcher.setSimilarity(new BM25Similarity());
            } else {
                searcher.setSimilarity(new ClassicSimilarity());
            }

            QueryParser parser = new QueryParser("text", analyzer);
            Query query = parser.parse(queryString);

            TopDocs topDocs = searcher.search(query, maxResults);
            StoredFields storedFields = searcher.storedFields();

            List<Document> results = new ArrayList<>();
            for (ScoreDoc scoreDoc : topDocs.scoreDocs) {
                org.apache.lucene.document.Document luceneDoc = storedFields.document(scoreDoc.doc);
                Long id = Long.parseLong(luceneDoc.get("id"));
                documentRepository.findById(id).ifPresent(results::add);
            }

            return results;
        }
    }

    public void deleteDocument(Long documentId) throws IOException {
        // Remove from MySQL database
        documentRepository.deleteById(documentId);

        // Remove from Lucene index
        try (IndexWriter writer = new IndexWriter(tfidfIndexDirectory, new IndexWriterConfig(analyzer))) {
            writer.deleteDocuments(new Term("id", documentId.toString()));
            writer.commit();
        }
        try (IndexWriter writer = new IndexWriter(bm25IndexDirectory, new IndexWriterConfig(analyzer))) {
            writer.deleteDocuments(new Term("id", documentId.toString()));
            writer.commit();
        }
    }


    // Utility method for getting index directory paths
    public String getBm25IndexPath() {
        return bm25IndexDirectory.toString();
    }

    public String getTfidfIndexPath() {
        return tfidfIndexDirectory.toString();
    }
}