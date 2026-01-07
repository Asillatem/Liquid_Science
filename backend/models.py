from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    zotero_id: Optional[str] = Field(default=None, index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

    projects: List["Project"] = Relationship(back_populates="user")


class Project(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    name: str = Field(default="Untitled Project")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    modified_at: datetime = Field(default_factory=datetime.utcnow)
    active_document: Optional[str] = None  # Path to currently open PDF/HTML

    user: Optional[User] = Relationship(back_populates="projects")
    nodes: List["Node"] = Relationship(back_populates="project")
    edges: List["Edge"] = Relationship(back_populates="project")


class Node(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id")

    # Content
    content: str  # Extracted text label
    zotero_item_key: Optional[str] = None  # For future Zotero integration
    source_document: str  # PDF/HTML path

    # Location in source document
    page_index: int = 0
    rect_x: float = 0
    rect_y: float = 0
    rect_width: float = 0
    rect_height: float = 0

    # Canvas position
    position_x: float = 0
    position_y: float = 0

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)

    project: Optional[Project] = Relationship(back_populates="nodes")

    # Edges where this node is source or target
    source_edges: List["Edge"] = Relationship(
        back_populates="source_node",
        sa_relationship_kwargs={"foreign_keys": "Edge.source_node_id"}
    )
    target_edges: List["Edge"] = Relationship(
        back_populates="target_node",
        sa_relationship_kwargs={"foreign_keys": "Edge.target_node_id"}
    )


class Edge(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    project_id: int = Field(foreign_key="project.id")
    source_node_id: int = Field(foreign_key="node.id")
    target_node_id: int = Field(foreign_key="node.id")
    label: Optional[str] = None
    edge_type: str = Field(default="smoothstep")  # smoothstep, default, straight

    project: Optional[Project] = Relationship(back_populates="edges")
    source_node: Optional[Node] = Relationship(
        back_populates="source_edges",
        sa_relationship_kwargs={"foreign_keys": "Edge.source_node_id"}
    )
    target_node: Optional[Node] = Relationship(
        back_populates="target_edges",
        sa_relationship_kwargs={"foreign_keys": "Edge.target_node_id"}
    )


class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    node_id: int = Field(foreign_key="node.id")
    text: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    edited_at: Optional[datetime] = None


class Highlight(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    node_id: int = Field(foreign_key="node.id")
    document_path: str  # PDF path this highlight belongs to
    page_index: int

    # Highlight rectangle (can have multiple rects for multi-line)
    rect_x: float
    rect_y: float
    rect_width: float
    rect_height: float

    color: Optional[str] = None
